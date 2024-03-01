import { CheerioAPI } from "cheerio";
import { Scrapper } from "./scraper";
import fs from "fs/promises";

const scrapper = new Scrapper({ loadUrlDelay: 1000 });

interface Anime {
  title: string;
  rating: number;
  img: string;
  plannedSeries: number;
  releasedSeries: number;
}

const main = async () => {
  try {
    const mainPage = await scrapper.loadUrl("https://amedia.site/");

    // const pagesCount = getPagesCount(mainPage);
    const pagesCount = 1;

    const animes: Anime[] = [];

    for (let pageNumber = 1; pageNumber <= pagesCount; pageNumber += 1) {
      const currentPage = await scrapper.loadUrl(
        `https://amedia.site/page/${pageNumber}/`
      );

      const cards = currentPage("#dle-content > .poster");

      cards.each((_, card) => {
        const $card = currentPage(card);

        const series = $card.find(".vysser").text().trim();
        const plannedSeries = parseInt(series.match(/\d+\+?$/)?.[0]);
        const releasedSeries = parseInt(series.match(/^\d+/)?.[0]);

        animes.push({
          title: $card.find(".poster__desc").text().trim(),
          rating: Number($card.find(".item__rating").text()),
          img: $card.find("div > img").attr("src").trim(),
          plannedSeries,
          releasedSeries,
        });
      });
    }

    await fs.writeFile(
      "./animes.json",
      JSON.stringify(animes, null, 2),
      "utf8"
    );
  } catch (e) {
    console.log(e);
  }
};

function getPagesCount(ch: CheerioAPI): number {
  const text = ch(".pagination__pages > a:last").text();

  const pagesCount = Number(text);

  if (Number.isNaN(pagesCount) || pagesCount <= 0) return 0;

  return pagesCount;
}

main();
