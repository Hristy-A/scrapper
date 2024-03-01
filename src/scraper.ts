import axios from "axios";
import { load, CheerioAPI } from "cheerio";

interface ScrapperOptions {
  loadUrlDelay?: number;
}

export class Scrapper {
  static load = load;
  static async loadUrl(url: string): Promise<CheerioAPI> {
    const { data } = await axios.get<string>(url);
    return load(data);
  }

  readonly loadUrlDelay: number;

  constructor(options: ScrapperOptions) {
    this.loadUrlDelay = options.loadUrlDelay;
  }

  public load = load;
  public async loadUrl(url: string): Promise<CheerioAPI> {
    const { data } = await axios.get<string>(url);
    const page = load(data);

    if (this.loadUrlDelay) {
      return new Promise((res) => setTimeout(res, this.loadUrlDelay, page));
    }

    return page;
  }
}
