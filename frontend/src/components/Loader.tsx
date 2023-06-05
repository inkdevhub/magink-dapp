import wizard from "../assets/wizard.png";

export const Loader = ({ message }: { message: string }) => {
  return (
    <div className="overflow-hidden">
      <div className="container">
        <img src={wizard} className="wizard" alt="wizard" />
        <div className="text-info">
          <h1>Swanky Magink! School</h1>
          <div className="tag-line">
            <span>
            Lets's learn some magink! about the{" "}
              <a
                href="https://use.ink"
                target="_blank"
                rel="noopener noreferrer"
              >
                ink! smart contract language
              </a>
            </span>
            .
          </div>
          <p></p>
          <hr />
          <p></p>
          <h3><a href="https://www.freepik.com/free-vector/magic-isometric-icons-set-with-wizards-witches-various-stuff-witchcraft-alchemy-isolated-white-background-3d-vector-illustration_26765318.htm#&position=1&from_view=collections">Images by macrovector</a> on Freepik</h3>
          <h3 className="animate-pulse text-lg font-semibold mt-6">{message}</h3>
        </div>
      </div>
    </div>
  );
};
