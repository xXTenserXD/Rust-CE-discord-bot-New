const { Client, Intents, Permissions } = require('discord.js');
require('dotenv').config(); // Load environment variables from .env file
const fs = require('fs');

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
});

const TOKEN = process.env.DISCORD_TOKEN;
const PREFIX = '!'; // Command prefix

// Load premium users from file
let premiumUsers = [];
try {
    const data = fs.readFileSync('premiumUsers.json');
    premiumUsers = JSON.parse(data);
} catch (err) {
    console.error('Error reading premium users file:', err);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore bot messages
    if (!message.content.startsWith(PREFIX)) return; // Check for prefix

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Command: !ping
    if (command === 'ping') {
        message.channel.send('Pong!');
    }

    // Command: !premium
    if (command === 'premium') {
        message.channel.send('```Welcome to Premium Help. To get started we do not currently have an automated system for payment so the role will be added to you manually. To get started with premium feature please make a ticket and contact the Lead Developers for help.```');
    }

    // Command: !connect <ip> <port>
    if (command === 'connect') {
        const ip = args[0];
        const port = args[1];
        if (!ip || !port) {
            message.channel.send('Usage: !connect <ip> <port>');
            return;
        }

        // Simulate connection (replace with actual logic)
        const isConnected = simulateConnection(ip, port);
        if (isConnected) {
            message.channel.send(`Successfully connected to Rust server at ${ip}:${port}`);
        } else {
            message.channel.send(`Failed to connect to Rust server at ${ip}:${port}. Please check the IP and port.`);
        }
    }

    // Command: !players
    if (command === 'players') {
        const playerCount = fetchPlayerCountFromServer(); // Replace with your player count function
        message.channel.send(`Current players: ${playerCount}`);
    }

    // Command: !ticket
    if (command === 'ticket') {
        const guild = message.guild;
        const user = message.author;

        // Create a new ticket channel
        const channel = await guild.channels.create({
            name: `ticket-${user.username}`,
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [Permissions.FLAGS.VIEW_CHANNEL]
                },
                {
                    id: user.id,
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                },
                {
                    id: 'staff-role-id', // Replace 'staff-role-id' with actual staff role ID
                    allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES]
                }
            ]
        });

        channel.send(`Hello ${user}, a staff member will be with you shortly.`);
    }

    // Command: !assign <roleName>
    if (command === 'assign') {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send('You do not have permission to use this command.');
        }

        const roleName = args.join(' ');
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (!role) return message.channel.send(`Role '${roleName}' not found.`);

        try {
            await message.member.roles.add(role);
            message.channel.send(`Role '${role.name}' assigned successfully.`);
        } catch (error) {
            console.error('Error assigning role:', error);
            message.channel.send(`Failed to assign role '${role.name}'.`);
        }
    }

    // Command: !remove <roleName>
    if (command === 'remove') {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send('You do not have permission to use this command.');
        }

        const roleName = args.join(' ');
        const role = message.guild.roles.cache.find(role => role.name === roleName);
        if (!role) return message.channel.send(`Role '${roleName}' not found.`);

        try {
            await message.member.roles.remove(role);
            message.channel.send(`Role '${role.name}' removed successfully.`);
        } catch (error) {
            console.error('Error removing role:', error);
            message.channel.send(`Failed to remove role '${role.name}'.`);
        }
    }

    // Add more commands as needed

});

// Function to simulate server connection (replace with actual logic)
function simulateConnection(ip, port) {
    // Example: Simulate success if port is even, failure if odd
    return port % 2 === 0;
}

// Function to fetch player count from server (replace with actual implementation)
function fetchPlayerCountFromServer() {
    // Example: Fetch player count from server
    return Math.floor(Math.random() * 100); // Replace with actual data retrieval
}

client.login(TOKEN);
