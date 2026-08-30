import { ReaderIcon } from "@radix-ui/react-icons";
import { Award, Book as BookIcon } from "react-feather";

// title/description text lives in messages/*/common.json under "nav.<key>"
// and "nav.<key>Description" — see Navbar for how these keys are resolved.
const navigationCategory = [
  { key: "home", href: "/", subCategories: [] },
  {
    key: "aboutUs",
    icon: ReaderIcon,
    href: "/about",
    subCategories: [
      {
        key: "aboutUs",
        href: "/about",
      },
      {
        key: "principalMessage",
        href: "/principal-message",
      },
      {
        key: "facilities",
        href: "/facilities",
      },
      {
        key: "busRoutePlan",
        href: "bus-route-plan",
      },
      {
        key: "faculty",
        href: "/faculty",
      },
    ],
  },
  {
    key: "gallery",
    subCategories: [],
    href: "/gallery",
  },
  {
    key: "academics",
    icon: BookIcon,
    href: "/academics",
    subCategories: [
      {
        key: "academics",
        href: "/academics",
      },
      {
        key: "library",
        href: "/library",
      },
      {
        key: "timeTable",
        href: "/time-table",
      },
      {
        key: "testimonials",
        href: "/testimonials",
        absolute: true,
      },
    ],
  },
  {
    key: "achievements",
    icon: Award,
    href: "/achievements",
    subCategories: [
      {
        key: "achievements",
        href: "/achievements",
      },
      {
        key: "toppers",
        href: "/toppers",
      },
    ],
  },
  {
    key: "homework",
    href: "/homework",
    subCategories: [],
  },
  {
    key: "newsNotices",
    href: "/news-notices",
    subCategories: [],
  },
];

export default navigationCategory;
