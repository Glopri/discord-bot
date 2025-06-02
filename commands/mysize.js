const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'size.txt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mysize')
    .setDescription('View your saved size and the 5 closest other users'),

  async execute(interaction) {
    const userId = interaction.user.id;

    if (!fs.existsSync(filePath)) {
      return interaction.reply({ content: 'No size data found.' });
    }

    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const entries = lines.map(line => {
      const [id, sizeStr] = line.split(':').map(s => s.trim());
      return { id, size: parseInt(sizeStr, 10) };
    });

    const userEntry = entries.find(e => e.id === userId);

    if (!userEntry) {
      return interaction.reply({ content: 'You have not saved a size yet. Use `/setSize` first.' });
    }

    const userSize = userEntry.size;

    // Filter out current user, then sort by absolute difference from userSize
    const nearby = entries
      .filter(e => e.id !== userId)
      .sort((a, b) => Math.abs(a.size - userSize) - Math.abs(b.size - userSize))
      .slice(0, 5); // Get 5 nearest

    let message = `📏 **Your size:** ${userSize}\n`;

    if (nearby.length > 0) {
      message += `👥 **5 closest users:**\n`;
      for (const entry of nearby) {
        message += `• <@${entry.id}>: ${entry.size}\n`;
      }
    } else {
      message += `❌ No other sizes found.`;
    }

    return interaction.reply({ content: message });
  }
};
