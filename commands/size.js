const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'size.txt');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set')
    .setDescription('Set your dih size')
    .addIntegerOption(option =>
      option.setName('lenght')
        .setDescription('Your dih size in inches')
        .setRequired(true)
    ),

  async execute(interaction) {
    const size = interaction.options.getInteger('value');
    const userId = interaction.user.id;

    // Read existing data (if any)
    let data = '';
    if (fs.existsSync(filePath)) {
      data = fs.readFileSync(filePath, 'utf8');
    }

    // Split into lines and filter out any line matching the userId
    const updatedLines = data
      .split('\n')
      .filter(line => !line.startsWith(`${userId}:`) && line.trim() !== '');

    // Add the new line
    updatedLines.push(`${userId}: ${size}`);

    // Join lines and save
    fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf8');

    // Respond to user
    await interaction.reply({
      content: `✅ Your size (${size}) has been saved.`,
      ephemeral: true
    });
  }
};
