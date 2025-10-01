//1.meta- its the data about button
//2.stories

import { Button, buttonVariants } from "../ui/button";
import type { Meta, StoryObj } from "@storybook/react";
// import  action  from '@storybook/addon-actions/preview';

import {fn} from "storybook/test"
const meta = {
  title: "component/ui/button",
  component: Button,
  tags: ["autodocs"],
  args: {
    variant: "default",
    size: "default",
    onClick: fn()
  },
  argTypes: {
    // variant: {
    //   control: "radio",
    //   options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    // },
    size: {
      control: "radio",
      options: ["default", "sm", "lg", "icon"],
    },
  }
} as Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Default Button",
    variant: "default",
    // onClick: action('clicked')
  },
};

export const Destructive: Story = {
  args: {
    children: "Distructive Button",
    variant: "destructive",
  },
};
export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};
export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};
export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

//combination of varients and sizes
// export const AllVariantsAndSizes: Story = {
//   render: () => {
//     // Define variants and sizes manually since cva() returns a function
//     const variants = [
//       "default",
//       "destructive",
//       "outline",
//       "secondary",
//       "ghost",
//       "link",
//     ] as const;
//     const sizes = ["default", "sm", "lg", "icon"] as const;

//     return (
//       <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//         {variants.map((variant) => (
//           <div key={variant}>
//             <strong>{variant}</strong>
//             <div
//               style={{
//                 display: "flex",
//                 gap: "12px",
//                 flexWrap: "wrap",
//                 marginTop: "4px",
//               }}
//             >
//               {sizes.map((size) => (
//                 <Button key={size} variant={variant} size={size}>
//                   {size}
//                 </Button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   },
// };
