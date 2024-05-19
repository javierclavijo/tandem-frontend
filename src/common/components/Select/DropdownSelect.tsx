import Select, { GroupBase, Props, StylesConfig } from "react-select";
import { COLORS } from "../../constants";

interface DropdownSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group> {}

/**
 * Select element styled like a dropdown.
 */
const DropdownSelect = <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
>({
  styles,
  ...props
}: DropdownSelectProps<TOption, TIsMulti, TGroup>) => (
  <Select<TOption, TIsMulti, TGroup>
    {...props}
    styles={{
      // @ts-expect-error | The styles object's TGroup generates TS errors for
      // some reason. I'm not using groups in this project (at least yet), so
      // fixing it would be a waste of time right now.
      ...(select as StylesConfig<TOption, TIsMulti, TGroup>),
      ...styles,
    }}
  />
);

export const select: StylesConfig = {
  menu: (provided) => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
    color: COLORS.DARK,
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: "none",
    border: "none",
    boxShadow: "none",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: COLORS.WHITE,
    ":hover": {
      color: COLORS.SECONDARY,
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: COLORS.WHITE,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
};

export default DropdownSelect;
