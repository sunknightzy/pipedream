import common from '../send-message-common.mjs'

export default {
  ...common,
  key: 'discord_webhook-send-message-zh-cn',
  name: '发送简单消息',
  description: '发送简单消息',
  version: '1.0.0',
  type: 'action',
  props: {
    ...common.props,
  },
  async run({ $ }) {
    const { message, avatarURL, threadID, username } = this

    try {
      // No interesting data is returned from Discord
      await this.discordWebhook.sendMessage({
        avatarURL,
        threadID,
        username,
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
