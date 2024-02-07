"use client";
import { Box, Text, VStack, Spinner, Center } from "@chakra-ui/react";
import Image from "next/image";
import styles from "./page.module.css";
import Wallet from "./wallet";
import { useState, useEffect } from "react";

interface WalletData {
    address: string;
    balances: { amount: string }[];
}

interface KeepKeyData {
    [key: string]: {
        wallet: WalletData;
    };
}

export default function Home() {
    const [keepKey, setKeepKey] = useState<KeepKeyData | null>(null);



    if (!keepKey) {
        return (
            <Center h="100vh">
                <Wallet setKeepKey={setKeepKey}/>
                <Spinner size="xxxl" />
            </Center>
        );
    }

    return (
        <main className={styles.main}>
            <div className={styles.description}>
                <p>Get started with KeepKey</p>
                <div>
                    <Wallet setKeepKey={setKeepKey} />
                </div>
            </div>

            <VStack spacing={4}>
                {Object.entries(keepKey).map(([currency, data]) => (
                    <Box key={currency} p={5} shadow="md" borderWidth="1px">
                        <Text fontSize="xl">{currency}</Text>
                        <Text>Address: {data.wallet.address}</Text>
                        {data.wallet.balances.map((balance, index) => (
                            <Text key={index}>Balance: {balance.ticker || balance.total}</Text>
                        ))}
                    </Box>
                ))}
            </VStack>
        </main>
    );
}
