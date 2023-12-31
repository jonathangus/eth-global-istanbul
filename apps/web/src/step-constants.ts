import { ACTIONS } from "../schemas";

export const STEP_CONDITIONS = [
  {
    value: "the-graph",
    label: "The Graph",
    icon: "https://imgur.com/QsAmTQp.png",
  },
  {
    value: "api3",
    label: "API3",
    icon: "https://imgur.com/ucBptOz.png",
  },
  {
    value: "http-call",
    label: "HTTP",
    icon: "https://e7.pngegg.com/pngimages/592/502/png-clipart-logo-application-programming-interface-computer-programming-application-software-api-text-photography.png",
  },
];

export const STEP_ACTIONS = [
  {
    value: ACTIONS.SWAP_ON_1INCH,
    label: "Swap on 1inch",
    icon: "/icons/1inch-logo.svg",
  },
  {
    value: ACTIONS.SEND_ERC_721,
    label: "Send tokens",
    icon: "https://i.imgur.com/kHBwLcW.png",
  },
  {
    value: ACTIONS.MINT_NFT,
    label: "Mint NFT",
    icon: "https://cdn-icons-png.flaticon.com/512/6298/6298900.png",
  },
  {
    value: "send-sms",
    label: "SMS",
    icon: "https://imgur.com/ruJpq58.png",
  },
  {
    value: "push-protocol",
    label: "Push Protocol",
    icon: "https://app.push.org/static/media/PushBlocknativeLogo.04b115a4c0b42bef077b2bc69647b1e0.svg",
  },
  {
    value: "aave",
    label: "Stake on AAve",
    icon: "https://imgur.com/kuqBTwj.png",
  },
];
