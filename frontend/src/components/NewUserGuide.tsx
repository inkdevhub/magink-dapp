import { useBalance, useWallet } from "useink";

export const NewUserGuide = () => {
  const { account } = useWallet();
  const balance = useBalance(account);
  const hasFunds = !balance?.freeBalance.isEmpty && !balance?.freeBalance.isZero();

  return (
    <div className="text-xs text-gray-300 text-left">
      {account && !hasFunds && (
        <div className="mb-1">
          <p className="mb-1">Account balance is zero.</p>
          To obtain Shibuya testnet tokens (SBY) go to Astar portal{" "}
          <a
            href="https://portal.astar.network/shibuya-testnet/assets#/astar/assets"
            rel="noopener noreferrer"
            target="_blank"
          >
            Shibuya Faucet
          </a>{" "}
        </div>
      )}
    </div>
  );
};

