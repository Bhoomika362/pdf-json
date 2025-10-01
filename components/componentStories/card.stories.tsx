// import { title } from "process";
// import { Card } from "../ui/card";
// import { Meta, StoryObj } from "@storybook/react";

// const meta = {
//   title: "component/ui/card",
//   component: Card,
//   tags: ["autodocs"],
// } as Meta<typeof Card>;

// export default meta;

// type Story = StoryObj<typeof Card>;

// export const Default: Story = {
//   args: {
//     children: "This is a card",
//   },
// };

// card.stories.tsx
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";

const meta: Meta<typeof Card> = {
  title: "components/ui/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

// Default Card story
// export const Default: Story = {
//   args: {
//     title: "Card Title",
//     description: "This is a description for the card.",
//     content: "Here is some content inside the card.",
//   },

//   render: ({ title, description, content }) => (
//     <Card>
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//         <CardDescription>{description}</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>{content}</p>
//       </CardContent>
//       <CardFooter>
//         <Button variant="default" size="sm" onClick={() => alert("Clicked!")}>
//           Action
//         </Button>
//       </CardFooter>
//     </Card>
//   ),
// };

interface CardStoryArgs {
  title: string;
  description: string;
  content: string;
}

// Default Card story
export const Default: StoryObj<CardStoryArgs> = {
  args: {
    title: "Card Title",
    description: "This is a description for the card.",
    content: "Here is some content inside the card.",
  },

  render: ({ title, description, content }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Button variant="default" size="sm" onClick={() => alert("Clicked!")}>
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const NoFooter: StoryObj<CardStoryArgs> = {
  args: {
    title: "Card Title",
    description: "This is a description for the card.",
    content: "Here is some content inside the card.",
  },
  render: ({ title, description, content }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
    </Card>
  ),
};

export const WithButton: StoryObj<CardStoryArgs> = {
  args: {
    title: "Card Title",
    description: "This is a description for the card.",
    content: "Here is some content inside the card.",
  },

  render: ({ title, description, content }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{content}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant="default"
          size="sm"
          onClick={() => alert("Action clicked")}
        >
          Click Me
        </Button>
      </CardFooter>
    </Card>
  ),
};
