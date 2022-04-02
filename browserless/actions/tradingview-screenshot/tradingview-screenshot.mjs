import puppeteer from 'puppeteer-core'

export default {
  key: 'tradingview-screenshot',
  name: 'Take a Screenshot of TradingView',
  version: '0.0.3',
  type: 'action',
  props: {
    browserless: {
      type: 'app',
      app: 'browserless',
    },
    chartId: {
      type: 'string',
      label: 'ChartId',
      optional: false,
      description:
        "Enter the chart id you'd like to take a screenshot of tradingview",
    },
    exchange: {
      type: 'string',
      label: 'Exchange',
      optional: false,
      description: "Enter the exchange name you'd like to visit",
    },
    ticker: {
      type: 'string',
      label: 'Ticker',
      optional: false,
      description: "Enter the ticker you'd like to visit",
    },
    interval: {
      type: 'string',
      label: 'Interval',
      optional: false,
      description: "Enter the interval you'd like to visit",
    },
    theme: {
      type: 'string',
      label: 'Theme',
      description: "Enter the theme you'd like to visit",
      optional: true,
      default: 'dark',
      options: ['default', 'dark'],
    },
  },
  async run({ $ }) {
    const blockedResourceTypes = [
      'image',
      'media',
      'font',
      'texttrack',
      'object',
      'beacon',
      'csp_report',
      'imageset',
    ]

    const skippedResources = [
      'quantserve',
      'adzerk',
      'doubleclick',
      'adition',
      'exelator',
      'sharethrough',
      'cdn.api.twitter',
      'google-analytics',
      'googletagmanager',
      'google',
      'fontawesome',
      'facebook',
      'analytics',
      'optimizely',
      'clicktale',
      'mixpanel',
      'zedo',
      'clicksor',
      'tiqcdn',
    ]
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${this.browserless.$auth.api_key}`,
    })
    const page = await browser.newPage()
    await page.setRequestInterception(true)
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
    )
    await page.setViewport({
      width: 2560,
      height: 1600,
    })
    page.on('request', (request) => {
      const requestUrl = request._url.split('?')[0].split('#')[0]
      if (
        blockedResourceTypes.indexOf(request.resourceType()) !== -1 ||
        skippedResources.some((resource) => requestUrl.indexOf(resource) !== -1)
      ) {
        request.abort()
      } else {
        request.continue()
      }
    })
    const { chartId, exchange, ticker, interval, theme } = this
    const chartUrl = `https://www.tradingview.com/chart/${chartId}?symbol=${exchange}:${ticker}&interval=${interval}&theme=${theme}`
    await page.goto(chartUrl)
    // 图表放大快捷键 Ctrl + ↑
    await page.keyboard.down('ControlLeft')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.press('ArrowUp')
    await page.keyboard.up('ControlLeft')
    const retrievedData = await page.evaluate(() => {
      return this._exposed_chartWidgetCollection.takeScreenshot()
    })
    await browser.close()
    const imageId = retrievedData.toString()
    const picUrl = `https://s3.tradingview.com/snapshots/${imageId
      .substring(0, 1)
      .toLowerCase()}/${imageId}.png`

    return { picUrl }
  },
}
