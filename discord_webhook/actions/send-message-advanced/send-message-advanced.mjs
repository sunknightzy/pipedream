import common from '../send-message-common.mjs'

export default {
  ...common,
  key: 'discord_webhook-send-message-advanced-zh-cn',
  name: '发送消息高级版',
  description: '给 Discord 简单的消息或者富文本消息',
  version: '1.0.0',
  type: 'action',
  props: {
    ...common.props,
    message: {
      propDefinition: [common.props.discordWebhook, 'message'],
      optional: true,
    },
    embeds: {
      propDefinition: [common.props.discordWebhook, 'embeds'],
    },
  },
  async run({ $ }) {
    const { message, avatarURL, threadID, username, embeds } = this

    if (!message && !embeds) {
      throw new Error('必须填写 Message 或者 Embeds 之中的一项')
    }

    try {
      // No interesting data is returned from Discord
      await this.discordWebhook.sendMessage({
        avatarURL,
        threadID,
        username,
        embeds,
        content: message,
      })
      $.export('$summary', '发送成功')
    } catch (err) {
      const unsentMessage = this.getUserInputProps()
      $.export('unsent', unsentMessage)
      throw err
    }
  },
}
