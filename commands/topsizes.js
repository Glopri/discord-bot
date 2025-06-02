const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'size.txt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the top 5 users by size'),

  async execute(interaction) {
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

    if (entries.length === 0) {
      return interaction.reply({ content: 'No users have saved a size yet.' });
    }

    // Sort descending by size and take top 5
    const top = entries
      .sort((a, b) => b.size - a.size)
      .slice(0, 5);

    let message = '🏆 **Top 5 Users by Size:**\n';

    for (let i = 0; i < top.length; i++) {
      const entry = top[i];
      let userDisplay = `Unknown User (${entry.id})`;

      try {
        const user = await interaction.client.users.fetch(entry.id);
        userDisplay = user.username;
      } catch (err) {
        console.warn(`Could not fetch user ${entry.id}: ${err}`);
      }

      message += `#${i + 1} • ${userDisplay}: ${entry.size}\n`;
    }

    return interaction.reply({ content: message });
  }
};
