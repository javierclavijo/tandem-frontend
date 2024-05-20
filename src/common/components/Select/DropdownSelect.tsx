import { Ref, forwardRef } from "react";
import ReactSelect, { GroupBase, Props, StylesConfig } from "react-select";
import Select from "react-select/base";
import { COLORS } from "../../constants";

interface DropdownSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
> extends Props<TOption, TIsMulti, TGroup> {}

/**
 * Select element styled like a dropdown.
 */
const DropdownSelect = <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
>(
  { styles, ...props }: DropdownSelectProps<TOption, TIsMulti, TGroup>,
  ref?: Ref<Select<TOption, TIsMulti, TGroup>>,
) => (
  <ReactSelect<TOption, TIsMulti, TGroup>
    menuPortalTarget={document.body}
    {...props}
    ref={ref}
    styles={{
      // @ts-expect-error | The styles object's TGroup generates TS errors for
      // some reason. I'm not using groups in this project (at least yet), so
      // fixing it would be a waste of time right now.
      ...(select as StylesConfig<TOption, TIsMulti, TGroup>),
      ...styles,
    }}
  />
);

const select: StylesConfig = {
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
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const ForwardedDropdownSelect = forwardRef(DropdownSelect) as <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
>(
  props: DropdownSelectProps<TOption, TIsMulti, TGroup>,
  ref?: Ref<Select<TOption, TIsMulti, TGroup>>,
) => JSX.Element;

export default ForwardedDropdownSelect;
