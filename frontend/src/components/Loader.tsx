
export const Loader = ({ message }: { message: string }) => {
  return (
    <div className="overflow-hidden">
      <div className="container">
        <div className="text-info">
          <h1>Tamagotchink!</h1>
          <div className="tag-line">
            <span>
            The game to grow your Tamagotchi with the{" "}
              <a
                href="https://github.com/paritytech/ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                ink! smart contract language
              </a>
            </span>
            .
          </div>
          <h3 className="animate-pulse text-lg font-semibold mt-6">{message}</h3>
        </div>
      </div>
    </div>
  );
};
