import React, { useState } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Text,
  Input,
  Flex,
  FormControl,
  useToast,
  Select,
  Tooltip,
  Skeleton,
  Divider,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import ExplorerBlockCard from "./ExplorerBlockCard";
import ExplorerBlockToast from "./ExplorerBlockToast";
import { QuorumBlock } from "../../types/Explorer";
import { motion } from "framer-motion";
const BoxMotion = motion(Box);

interface IProps {
  blocks: QuorumBlock[];
  url: string;
  onSelectChange: (e: any) => void;
  timeoutReceived: boolean;
}

export default function ExplorerBlocks(props: IProps) {
  const [blockSearch, setBlockSearch] = useState("");
  const toast = useToast();
  const toastIdRef: any = React.useRef();

  const closeToast = () => {
    if (toastIdRef.current) {
      toast.close(toastIdRef.current);
    }
  };

  const onChange = (e: any) => {
    setBlockSearch(e.target.value);
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const res = await axios({
      method: "POST",
      url: `/api/blockGetByNumber`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        rpcUrl: props.url,
        blockNumber: blockSearch,
      }),
      baseURL: `${process.env.NEXT_PUBLIC_QE_BASEPATH}`,
    });
    var block: QuorumBlock = res.data as QuorumBlock;
    toastIdRef.current = toast({
      position: "top-right",
      isClosable: true,
      duration: 10000,
      containerStyle: {
        width: "600px",
        maxWidth: "100%",
      },
      render: () => (
        <ExplorerBlockToast block={block} closeToast={closeToast} />
      ),
    });
  };

  return (
    <>
      <BoxMotion
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        as="section"
        py="16px"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          alignContent="center"
          mb={6}
          mx="16px"
        >
          <Text as="b" fontSize="lg">
            Blocks
          </Text>
          <Container maxW="40%" m={0} p={0}>
            <Flex justifyContent="flex-end" gap="16px">
              <Tooltip label="Select number of blocks back to display data">
                <Select maxW="20%" onChange={props.onSelectChange}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                </Select>
              </Tooltip>
              <FormControl as="form" onSubmit={onSubmit} maxW="50%">
                <Input
                  placeholder={"Search by block number"}
                  onInput={onChange}
                  onSubmit={onSubmit}
                />
              </FormControl>
            </Flex>
          </Container>
        </Flex>
        <Container maxW={{ base: "container.sm", md: "container.xl" }}>
          <SimpleGrid columns={{ base: 1, md: 4 }} gap={{ base: "5", md: "6" }}>
            {props.timeoutReceived && (
              <>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  flexDirection={{ base: "column", md: "column" }}
                  px={{ base: "5", md: "8" }}
                  pt={{ base: "5", md: "4" }}
                  pb={{ base: "5", md: "4" }}
                  borderRadius="lg"
                  borderWidth={2}
                  overflow="hidden"
                >
                  <VStack>
                    <Skeleton h="20px" w="130px" />
                    <Divider />
                    <Skeleton h="20px" w="130px" />
                    <Skeleton h="20px" w="130px" />
                  </VStack>
                </Flex>
              </>
            )}
            {props.blocks.map((block) => (
              <ExplorerBlockCard key={block.number} block={block} />
            ))}
          </SimpleGrid>
        </Container>
      </BoxMotion>
    </>
  );
}
