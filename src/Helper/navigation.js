import { ReaderIcon, RocketIcon } from "@radix-ui/react-icons";
import { Award, Book as BookIcon } from "react-feather";

const navigationCategory = [
  { title: "Home", href: "/", subCategories: [] },
  {
    title: "About Us",
    icon: ReaderIcon,
    href: "/about",
    subCategories: [
      {
        title: "About Us",
        href: "/about",
        description:
          "Discover our commitment to comprehensive education and student success.",
      },
      {
        title: "Principal's Message",
        href: "/principal-message",
        description:
          "Message from our Principal: Inspiring a passion for learning and a commitment to excellence.",
      },
      {
        title: "Facilities",
        href: "/facilities",
        description:
          "Discover our state-of-the-art facilities that provide a comfortable and engaging learning environment.",
      },

      {
        title: "Route Plan of School Buses",
        href: "bus-route-plan",
        description:
          "Explore our school bus routes and transportation options for safe and convenient travel to and from school.",
      },
      {
        title: "Faculty",
        href: "/faculty",
        description:
          "Meet our highly qualified and dedicated faculty who inspire and guide our students.",
      },
    ],
  },
  {
    title: "Gallery",
    subCategories: [],
    href: "/gallery",
  },
  {
    title: "Academics",
    icon: BookIcon,
    href: "/academics",
    description:
      "Explore our academic programs and achievements that reflect our commitment to excellence.",
    subCategories: [
      {
        title: "Academics",
        href: "/academics",
        description:
          "Discover our academic programs and achievements that reflect our commitment to excellence.",
      },
      {
        title: "Library",
        href: "/library",
        description:
          "Explore our library and resources that support our academic programs.",
      },
    ],
  },
  {
    title: "Achievements",
    icon: Award,
    href: "/achievements",
    subCategories: [
      {
        title: "Achievements",
        href: "/achievements",
        description:
          "We are thrilled to share some exciting news about our school's recent achievement!",
      },
      {
        title: "Toppers",
        href: "/toppers",
        description:
          "We are proud to announce the school toppers for this academic year!",
      },
    ],
  },
  {
    title: "Homework",
    href: "/homework",
    subCategories: [],
  },
];

export default navigationCategory;
