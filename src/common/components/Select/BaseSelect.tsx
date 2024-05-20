import { Ref, forwardRef } from "react";
import ReactSelect, { GroupBase, Props, StylesConfig } from "react-select";
import Select from "react-select/base";

interface BaseSelectProps<
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
> extends Props<TOption, TIsMulti, TGroup> {}

/**
 * Base styled select element.
 */
const BaseSelect = <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
>(
  { styles, ...props }: BaseSelectProps<TOption, TIsMulti, TGroup>,
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
  // Styles for react-select component
  menu: (provided) => ({
    ...provided,
    width: "max-content",
    minWidth: "100%",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const ForwardedBaseSelect = forwardRef(BaseSelect) as <
  TOption,
  TIsMulti extends boolean = false,
  TGroup extends GroupBase<TOption> = GroupBase<TOption>,
>(
  props: BaseSelectProps<TOption, TIsMulti, TGroup>,
  ref?: Ref<Select<TOption, TIsMulti, TGroup>>,
) => JSX.Element;

export default ForwardedBaseSelect;
