const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('size')
    .setDescription('Store your dih size')
    .addIntegerOption(option =>
      option.setName('dih_size')
        .setDescription('Your dih size')
        .setRequired(true)
    ),

  async execute(interaction) {
    const size = interaction.options.getInteger('value');
    const userId = interaction.user.id;
    const entry = `${userId}: ${size}\n`;

    // Save to size.txt in the project folder
    const filePath = path.join(__dirname, 'size.txt');

    // Ensure directory exists
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    // Append the entry to the file
    fs.appendFile(filePath, entry, err => {
      if (err) {
        console.error(err);
        return interaction.reply({ content: '❌ Failed to save your size.', ephemeral: true });
      }
      interaction.reply({ content: `✅ Size ${size} saved!`, ephemeral: true });
    });
  }
};
