import { Heading, Container, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import Head from "next/head";

const Welcome: NextPage = () => {
	return (
		<>
			<Head>
				<title>RS Journey Crafter | Welcome</title>
				<link rel="icon" href="/img/Crafting_icon.png" />
			</Head>
			<main>
				<Container
					maxW="container.lg"
					display="flex"
					flexDirection="column"
					px="12"
				>
					<Heading>Lorem ipsum dolor sit amet.</Heading>
					<Text>
						Lorem ipsum dolor sit amet consectetur adipisicing elit.
						Eligendi veritatis quae expedita nemo rerum, veniam
						iusto! Eum dolorum aut vero error quibusdam iusto
						explicabo perspiciatis libero. Quibusdam tempora tenetur
						architecto dicta corrupti ipsam mollitia porro veritatis
						voluptatem, qui impedit doloremque atque unde labore
						quaerat culpa quisquam numquam cumque quod, dolorum amet
						illo debitis animi! Quo laudantium velit soluta? Rem
						nulla provident non delectus distinctio fugiat sapiente
						obcaecati alias aperiam nostrum iure labore, consectetur
						amet neque ad nihil eos aliquam adipisci rerum dolor
						saepe voluptatum assumenda facilis! Nostrum omnis sint
						aperiam facilis consectetur nobis labore et quas minima,
						debitis saepe alias corrupti ex necessitatibus iure
						praesentium expedita nesciunt maiores earum, repudiandae
						optio tempora. Sed sit debitis voluptatem reprehenderit
						dolor beatae natus explicabo ea assumenda non!
						Asperiores necessitatibus sequi dignissimos cum rem
						eligendi voluptatibus cupiditate voluptates assumenda,
						quod minima molestiae porro, at saepe reiciendis dicta,
						quae itaque veniam eos dolor incidunt dolorem. Eum nulla
						sapiente maiores ab ducimus nesciunt illo ratione
						laborum odio velit consectetur aspernatur dolor ea quas,
						provident exercitationem nostrum aliquid modi totam sit
						quod dolores adipisci! Autem voluptas hic expedita
						quibusdam, harum eaque numquam praesentium laborum eum
						facere nisi veniam earum ipsam quam ducimus tempore
						sapiente temporibus? Suscipit illum, commodi repellendus
						alias quisquam sequi perspiciatis, unde eligendi
						voluptas praesentium doloremque fugit sunt odit? Maxime
						illo distinctio iste, optio maiores est explicabo? Id
						explicabo nam beatae, placeat labore molestias non
						temporibus, laborum quas provident reiciendis libero
						tempora nulla aliquid voluptate dolorum perferendis
						nihil ullam magnam in facilis dolores? Quam quisquam
						facere tenetur, voluptas!
					</Text>
					{/* <Button as={Link} href="/add-account" ml="auto" size="lg">
						Get Started
					</Button> */}
				</Container>
			</main>
		</>
	);
};

export default Welcome;
