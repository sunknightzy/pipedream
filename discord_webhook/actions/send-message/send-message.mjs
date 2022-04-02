import common from '../send-message-common.mjs'

export default {
  ...common,
  key: 'discord_webhook-send-message',
  name: 'Send Message',
  description: 'Send a simple message to a Discord channel',
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
      $.export('$summary', 'Message sent successfully')
    } catch (err) {
      const unsentMessage = this.getUserInputProps()
      $.export('unsent', unsentMessage)
      throw err
    }
  },
}
