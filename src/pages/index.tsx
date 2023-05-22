import {
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Head from "next/head";
import MyJourney from "../components/my-journey";

const Home = () => {
  return (
    <>
      <Head>
        <title>RS Journey Crafter | Home</title>
        <meta name="description" content="Home dashboard" />
        <link rel="icon" href="/img/Crafting_icon.png" />
      </Head>

      <Container maxW="container.lg" as="main">
        <Tabs variant="line" align="center">
          <TabList>
            <Tab>My Journey</Tab>
            <Tab>Templates</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <MyJourney />
            </TabPanel>
            <TabPanel>Coming Soon</TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default Home;
