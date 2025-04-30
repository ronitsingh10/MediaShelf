import { Button } from "@/components/ui/button";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""); // [A, B, C, ... , Z]

type AlphabetFilterProps = {
  selectedLetter: string;
  setSelectedLetter: (letter: string) => void;
};

const AlphabetFilter = ({
  selectedLetter,
  setSelectedLetter,
}: AlphabetFilterProps) => {
  return (
    <div className="flex flex-wrap mb-4 justify-center">
      {LETTERS.map((letter) => (
        <Button
          key={letter}
          size="xsm"
          variant={selectedLetter === letter ? "default" : "link"}
          onClick={() => setSelectedLetter(letter)}
        >
          {letter}
        </Button>
      ))}
      <Button
        size="xsm"
        variant={selectedLetter === "#" ? "default" : "link"}
        onClick={() => setSelectedLetter("#")}
      >
        #
      </Button>
      <Button
        size="xsm"
        variant={selectedLetter === "ALL" ? "default" : "link"}
        onClick={() => setSelectedLetter("ALL")}
      >
        ALL
      </Button>
    </div>
  );
};

export default AlphabetFilter;
