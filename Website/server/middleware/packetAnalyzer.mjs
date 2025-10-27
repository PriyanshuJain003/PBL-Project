import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvWriter = createObjectCsvWriter({
    path: path.join(__dirname, '../logs/capture.csv'),
    header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'srcIP', title: 'Source IP' },
        { id: 'srcPort', title: 'Source Port' },
        { id: 'destIP', title: 'Destination IP' },
        { id: 'destPort', title: 'Destination Port' },
        { id: 'protocol', title: 'Protocol' },
        { id: 'length', title: 'Length' },
        { id: 'httpMethod', title: 'HTTP Method' },
        { id: 'httpPath', title: 'HTTP Path' },
        { id: 'payload', title: 'Payload (Hex)' },
        { id: 'truncated', title: 'Truncated' },
        { id: 'dstPort', title: 'Dst Port' },
        { id: 'flowPktsPerSec', title: 'Flow Pkts/s' },
        { id: 'fwdHeaderLen', title: 'Fwd Header Len' },
        { id: 'bwdHeaderLen', title: 'Bwd Header Len' },
        { id: 'fwdPktsPerSec', title: 'Fwd Pkts/s' },
        { id: 'bwdPktsPerSec', title: 'Bwd Pkts/s' },
        { id: 'initFwdWinByts', title: 'Init Fwd Win Byts' },
        { id: 'initBwdWinByts', title: 'Init Bwd Win Byts' },
        { id: 'fwdActDataPkts', title: 'Fwd Act Data Pkts' },
        { id: 'fwdSegSizeMin', title: 'Fwd Seg Size Min' },
    ],
    append: true
});

const generateSimulatedPacket = () => {
    return {
        dstPort: Math.floor(Math.random() * 65535),
        flowPktsPerSec: Math.random() * 100,
        fwdHeaderLen: Math.floor(Math.random() * 40) + 20, // TCP header length typically 20-60 bytes
        bwdHeaderLen: Math.floor(Math.random() * 40) + 20,
        fwdPktsPerSec: Math.random() * 50,
        bwdPktsPerSec: Math.random() * 50,
        initFwdWinByts: Math.floor(Math.random() * 65535),
        initBwdWinByts: Math.floor(Math.random() * 65535),
        fwdActDataPkts: Math.floor(Math.random() * 100),
        fwdSegSizeMin: Math.floor(Math.random() * 1460) // typical MTU size
    };
};

const sendPacketToServer = async (packetData) => {
    try {
        const response = await axios.post('http://127.0.0.1:5000/predict', packetData);
        console.log('Server response:', response.data);
    } catch (error) {
        console.error('Error sending packet to server:', error);
    }
};

export const startPacketCapture = () => {
    console.log('Starting simulated packet capture');
    
    const interval = setInterval(async () => {
        try {
            const record = generateSimulatedPacket();

            // Send packet details to Flask server
            await sendPacketToServer(record);
            await csvWriter.writeRecords([record]);
            
            // Uncomment to see the simulated packets
            // console.log('Simulated packet:', record);
        } catch (err) {
            console.error('Error processing packet:', err);
        }
    }, 1000); // Generate a new packet every second

    // Return the interval ID so it can be cleared if needed
    return interval;
};
