"use client";
import { Box, Text, VStack, Spinner, Center, Button, Flex, useDisclosure, Modal, ModalBody, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, Input, ModalFooter } from "@chakra-ui/react";
import Image from "next/image";
import styles from "./page.module.css";
import Wallet from "./wallet";
import { useState, useEffect } from "react";
import { formatCacao } from "@/utils/formatBigInt";
import { useHandleTransfer } from './hooks/useHandleTransfer'; // Adjust the path as needed



// Define interface for a single balance item
interface BalanceItem {
    address: string;
    bigIntValue: bigint;
    chain: string;
    decimal: number;
    decimalMultiplier: bigint;
    isGasAsset: boolean;
    isSynthetic: boolean;
    symbol: string;
    tax?: any; // Since tax is undefined, its type is any or you can specify a more precise type if known
    ticker: string;
    type: string;
}

// Define interface for the wallet details
interface WalletDetails {
    address: string;
    balance: BalanceItem[];
    walletType: string;
}

// Define interface for wallet methods with function signatures
interface WalletMethods {
    approve: Function;
    approvedAmount: Function;
    broadcastTransaction: Function;
    call: Function;
    createContract: Function;
    transfer: (payload: any) => Promise<string>;
    // Add the rest of the methods as needed with specific signatures if known
}

// Define interface for each currency wallet data (BTC, ETH, MAYA, etc.)
interface CurrencyWalletData {
    walletMethods: WalletMethods;
    wallet: WalletDetails;
}

// Define the main WalletData interface to capture all possible keys dynamically
interface WalletData {
    [key: string]: CurrencyWalletData;
}

export default function Home() {
    const [keepKey, setKeepKey] = useState<WalletData | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [amountToSend, setAmountToSend] = useState("0.00001");
    const [destination, setDestination] = useState("maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k");
    const [selectedBalance, setSelectedBalance] = useState<BalanceItem | null>(null); // Step 1


    if (!keepKey) {
        return (
            <Center h="100vh">
                <Wallet keepkey={keepKey} setKeepKey={setKeepKey} />
                <Spinner size="xl" />
            </Center>
        );
    }

    // Initialize the hook at the top level of your component.
    const handleTransfer = useHandleTransfer(keepKey);

    const onClickSend = async () => {

        try {
            const txHash = await handleTransfer("CACAO", parseFloat(amountToSend), destination);
            onClose();
        } catch (error) {
            console.error("Error initiating transfer:", error);
        }
    };



    return (
        <>
            <main className={styles.main}>
                <div className={styles.description}>
                    <VStack spacing={4} align="stretch" justify="center" width="100%">
                        {Object.entries(keepKey).map(([currency, data]) => (
                            <Box key={currency} p={5} shadow="md" borderWidth="1px" borderRadius="lg">
                                <Text fontSize="2xl" fontWeight="bold" mb={3}>{currency}</Text>
                                <Text fontSize="md">Address: {data.wallet.address}</Text>
                                {data.wallet.balance.map((balance, index) => (
                                    <Flex key={index}>
                                        <Text fontSize="md" mt={1}>
                                            Balance: {formatCacao(balance.bigIntValue, balance.decimalMultiplier)} {balance.symbol}
                                        </Text>
                                        <Button
                                            onClick={() => {
                                                setSelectedBalance(balance); // Step 2
                                                onOpen();
                                            }}
                                            borderRadius={5}
                                            p={2}
                                            backdropBlur={5}
                                            border={"1px solid yellow"}
                                        >
                                            SEND {balance.symbol}
                                        </Button>
                                    </Flex>
                                ))}
                            </Box>
                        ))}
                    </VStack>
                </div>
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        {/* Using Flex to contain the header and close button */}
                        <Flex justifyContent="space-between" alignItems="center" p={4}>
                            <ModalHeader>Send {selectedBalance?.symbol}</ModalHeader>
                            <ModalCloseButton />
                        </Flex>
                        <ModalBody>
                            <Text mb={3}>Enter the amount to send:</Text>
                            <Input placeholder="Amount" value={amountToSend} onChange={(e) => setAmountToSend(e.target.value)} />
                            <Input placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />

                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClickSend}>
                                Send
                            </Button>

                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

            </main>
        </>
    );
}
