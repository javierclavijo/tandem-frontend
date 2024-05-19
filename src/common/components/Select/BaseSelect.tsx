import Select, { GroupBase, Props, StylesConfig } from "react-select";

interface BaseSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> extends Props<Option, IsMulti, Group> {}

/**
 * Base styled select element.
 */
const BaseSelect = <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
>({
  styles,
  ...props
}: BaseSelectProps<TOption, TIsMulti, TGroup>) => (
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
  // Styles for react-select component
  menu: (provided) => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
  }),
};

export default BaseSelect;
