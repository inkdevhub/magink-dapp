import * as Yup from "yup";
import { Values } from "../types";
import { pseudoRandomId } from "useink/utils";

export const initialValues: Values = { blocksToLive: 10 };

export const UrlShortenerSchema = Yup.object().shape({
  url: Yup.string().url().required("URL is a required field"),
  alias: Yup.string()
    .min(5, "Alias is too short! (min 5 characters)")
    .max(10, "Alias is too long! (max 10 characters)")
    .required("Alias is a required field"),
});

export const CONTRACT_ADDRESS =
<<<<<<< Updated upstream
  "bGMxiu9q9JQX2KtdeLjVdxErq3XkDVYyJ48BMC6vYGXWQ56";
=======
  "apJNVQJ5T4C5gZ1XRPw2MAHcUFxbuHch7BPGQuTyT8DHjeX";

export const astarFacts: string[] = [
  `Welcome to magink!, where the enchanting fusion of magic and <a href="https://use.ink/" target="_blank">ink!</a> awaits. Embark on an exciting journey into the world of smart contracts on the Astar Network. Earn badges for completing each lesson, showcasing your progress. And as the ultimate reward, claim your exclusive Wizard NFT upon conquering all ten lessons. Let the magic unfold in magink! as we explore the realms of possibility together.`,
  
  `Guess what? ink! is like Rust's cool and focused cousin, specifically designed to make smart contract development a breeze. It takes all the reliability and performance of Rust and adds a touch of simplicity that'll have you coding like a champ. <a href="https://use.ink/why-rust-for-smart-contracts" target="_blank">Why Rust?</a>`,

  `But wait, there's more... ink! plays really well with WebAssembly (Wasm), the superstar of smart contract execution. By compiling your code into this powerful format, ink! supercharges your contracts, making them run lightning-fast and saving precious resources. It's like giving your smart contracts a speed boost and a prudent mindset! <a href="https://use.ink/why-rust-for-smart-contracts" target="_blank">Why WebAssembly?</a>`,

  `ink! and the Substrate framework form the ultimate swanky duo for exploring and refining smart contracts before launching a parachain on Polkadot. With their seamless integration, developers can effortlessly unleash their creativity, fine-tune contract logic, and harness the power of modular design and robust infrastructure. Embrace the swanky synergy of ink! and Substrate to bring your visionary ideas to life, ensuring a flawless and glamorous parachain debut on Polkadot. <a href="https://use.ink/how-it-works" target="_blank">How it works?</a>`,

  `<a href="https://use.ink/ink-vs-solidity" target="_blank">ink! outshines Solidity</a> with its swanky simplicity and sophisticated features. With a seamless integration into the Astar Network and the power of Rust, ink! empowers developers to create secure and elegant smart contracts effortlessly. Say goodbye to the complexities of Solidity and embrace the swanky allure of ink! for a stylish and efficient smart contract development experience. Welcome to the future of smart contracts, where ink! reigns supreme.`,

  `Swanky Suite is the ultimate toolkit for building swanky smart contracts on Astar Network. It offers a seamless and sophisticated development experience and a secure testing environment. With Swanky Suite, you can embrace the elegance of ink! and effortlessly craft smart contracts. Get ready to make a statement with your smart contract creations as you unleash the full swankiness of <a href="https://docs.astar.network/docs/build/wasm/swanky-suite/" target="_blank">Swanky Suite</a>.`,

  `With <a href="https://use.ink/frontend/overview" target="_blank">useink React library</a> at your fingertips, you have the power to create dynamic and interactive user interfaces for your ink! dApps. This library offers a seamless and intuitive way to manage state, handle side effects, and breathe life into your frontend. Get ready to immerse yourself in the enchanting dance between ink! and React as you craft stunning and engaging user experiences. It's time to unleash the magic of ink! in your frontend development with the help of React library!`,
  
  `<a href="https://astar.network/" target="_blank">Astar</a>, the epitome of swankiness, supports virtual machines for both Solidity and ink! smart contracts. Developers can unleash their creativity with ease, whether they prefer the classic charm of Solidity or the sleek elegance of ink!. Astar offers a glamorous platform where versatility meets innovation, empowering developers to create stunning smart contract experiences. Embrace the allure of Astar as it brings together the best of both worlds, opening the doors to a world of limitless possibilities in smart contract development.`,

  `So, if you're itching to build amazing decentralized applications, <a href="https://use.ink/" target="_blank">ink!</a> is the perfect sidekick. With its user-friendly simplicity and the raw power of Rust, you'll be unleashing your creativity and crafting groundbreaking solutions in no time.`,

  `Darling, did you honestly think obtaining that NFT would be a mere walk in the park? Well, fear not! With the treasure trove of knowledge and references you've acquired from these lessons, you have the impeccable ability to contribute and shine with this dApp. Get ready to make your mark by using the template from <a href="https://github.com/swanky-dapps/magink-dapp" target="_blank">magink! repo</a> and elegantly extending this dApp with the NFT claiming functionality.`,
];
>>>>>>> Stashed changes
