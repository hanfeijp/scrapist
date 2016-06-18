"use strict";

const client = require("cheerio-httpcli");

const scrape = require("./scrape");

class Scrapist {

  constructor(scheme, config) {
    this._scheme = scheme;
    this._pages = scheme.pages.map((p, i) => Object.assign({}, p, {
      index: i
    }));
    this._config = Object.assign({}, Scrapist.defaultConfig, config);
  }

  get scheme() {
    return this._scheme;
  }

  get pages() {
    return this._pages;
  }

  get config() {
    return this._config;
  }

  beforeScrape() {
    if (this._scheme.before)
      this._scheme.before(client);
  }

  afterScrape(data) {
    if (this._scheme.after)
      return this._scheme.after(data);
    return data;
  }

  scrape(value, config) {
    return scrape(
      this._scheme.valueToUrls(value),
      this._pages,
      Object.assign({}, this._config, config)
    ).then(data => this.afterScrape(data));
  }

}

Scrapist.defaultConfig = {
  concurrency: 1,
  interval: 1000,
  onFetch: null
};

module.exports = Scrapist;
