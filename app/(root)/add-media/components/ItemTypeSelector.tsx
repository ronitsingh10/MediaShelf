import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { mediaTypes } from "@/lib/constants";

type ItemTypeSelectorProps = {
  itemType: string;
  setItemType: (value: string) => void;
  disabled?: boolean;
};

const ItemTypeSelector = ({
  itemType,
  setItemType,
  disabled = false,
}: ItemTypeSelectorProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Select Item Type</h2>
      <RadioGroup
        value={itemType}
        onValueChange={(value) => setItemType(value)}
        className="flex gap-6"
        disabled={disabled}
      >
        {mediaTypes.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <RadioGroupItem value={key} id={key} disabled={disabled} />
            <label
              htmlFor={key}
              className={`${
                disabled ? "text-gray-400 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {label.endsWith("s") ? label.slice(0, -1) : label}
            </label>
          </div>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground mt-2 italic">
        The type of item you are adding.
      </p>
    </div>
  );
};

export default ItemTypeSelector;
