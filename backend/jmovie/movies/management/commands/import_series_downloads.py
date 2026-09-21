import asyncio
import aiohttp
import json
import re
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from django.core.management.base import BaseCommand
from django.contrib.contenttypes.models import ContentType
from django.db import close_old_connections

from downloads.models import Download
from series.models import Series, Season, Episode


MAX_CONCURRENT_REQUESTS = 50
REQUEST_TIMEOUT = 30
RETRY_COUNT = 3


class Command(BaseCommand):
    help = "Import episode download links from directory listing"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str)

    def handle(self, *args, **options):

        json_file = options["json_file"]

        with open(json_file, encoding="utf-8") as f:
            data = json.load(f)

        self.stdout.write(
            self.style.SUCCESS(
                f"Found {len(data['movies'])} series"
            )
        )

        self.episode_ct = ContentType.objects.get_for_model(Episode)

        self.episode_index = {}

        self.stdout.write("Loading episodes...")

        episodes = (
            Episode.objects
            .select_related(
                "season",
                "season__series"
            )
            .only(
                "id",
                "episode_number",
                "season__season_number",
                "season__series__imdb_id"
            )
        )

        for ep in episodes:

            self.episode_index[
                (
                    ep.season.series.imdb_id,
                    ep.season.season_number,
                    ep.episode_number,
                )
            ] = ep.id

        self.stdout.write(
            self.style.SUCCESS(
                f"Indexed {len(self.episode_index)} episodes"
            )
        )

        asyncio.run(
            self.run(data["movies"])
        )



    async def run(self, movies):

        connector = aiohttp.TCPConnector(
            limit=MAX_CONCURRENT_REQUESTS,
            ssl=False,
        )

        timeout = aiohttp.ClientTimeout(
            total=REQUEST_TIMEOUT
        )

        semaphore = asyncio.Semaphore(
            MAX_CONCURRENT_REQUESTS
        )

        async with aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            headers={
                "User-Agent":
                    "Mozilla/5.0"
            },
        ) as session:

            self.session = session
            self.semaphore = semaphore

            tasks = []

            for movie in movies:

                imdb_id = movie["imdb_id"]

                for item in movie["downloads"]:

                    tasks.append(

                        asyncio.create_task(

                            self.process_directory(
                                imdb_id,
                                item
                            )

                        )

                    )

            total = len(tasks)

            self.stdout.write(
                self.style.SUCCESS(
                    f"{total} directories"
                )
            )

            processed = 0

            for task in asyncio.as_completed(tasks):

                await task

                processed += 1

                if processed % 50 == 0:

                    self.stdout.write(
                        self.style.SUCCESS(
                            f"{processed}/{total}"
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                "Finished."
            )
        )
    async def fetch(self, url):

        for _ in range(RETRY_COUNT):

            try:

                async with self.semaphore:

                    async with self.session.get(url) as response:

                        if response.status == 200:

                            return await response.text()

            except Exception:

                await asyncio.sleep(1)

        return None



    async def process_directory(
        self,
        imdb_id,
        item,
    ):

        html = await self.fetch(
            item["url"]
        )

        if not html:
            return

        soup = BeautifulSoup(
            html,
            "html.parser"
        )

        downloads = []

        quality = item["quality"]

        subtitle = (
            item["type"].lower()
            == "softsub"
        )

        language = (
            "original"
            if subtitle
            else "dubbed"
        )

        links = soup.find_all("a")

        for link in links:

            href = link.get("href")

            if not href:
                continue

            if not href.lower().endswith(
                (
                    ".mkv",
                    ".mp4",
                    ".avi",
                )
            ):
                continue

            filename = href.split("/")[-1]

            match = re.search(
                r"S(\d+)E(\d+)",
                filename,
                re.IGNORECASE,
            )

            if not match:
                continue

            season_number = int(
                match.group(1)
            )

            episode_number = int(
                match.group(2)
            )

            episode_id = self.episode_index.get(
                (
                    imdb_id,
                    season_number,
                    episode_number,
                )
            )

            if not episode_id:
                continue

            row = link.find_parent("tr")

            size = ""

            if row:

                cells = row.find_all("td")

                if len(cells) >= 3:

                    size = (
                        cells[2]
                        .get_text(
                            strip=True
                        )
                    )

            downloads.append(

                Download(

                    content_type=self.episode_ct,

                    object_id=episode_id,

                    title=filename,

                    quality=quality,

                    language=language,

                    subtitle=subtitle,

                    size=size,

                    url=urljoin(
                        item["url"] + "/",
                        href
                    ),

                    is_active=True,

                    is_vip=False,

                )

            )

        if downloads:

            await asyncio.to_thread(
                self.save_downloads,
                downloads
            )
    def save_downloads(self, downloads):

        close_old_connections()

        try:

            existing = set(

                Download.objects.filter(
                    content_type=self.episode_ct,
                    object_id__in=[
                        d.object_id
                        for d in downloads
                    ]
                ).values_list(
                    "object_id",
                    "quality",
                    "language",
                    "subtitle",
                    "url",
                )

            )

            objs = []

            for d in downloads:

                key = (
                    d.object_id,
                    d.quality,
                    d.language,
                    d.subtitle,
                    d.url,
                )

                if key in existing:
                    continue

                objs.append(d)

            if objs:

                Download.objects.bulk_create(
                    objs,
                    batch_size=1000,
                    ignore_conflicts=True,
                )

        finally:

            close_old_connections()