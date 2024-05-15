import { useForm } from "react-hook-form";
import { ChannelCreationFormValues } from "./types";

export const useChannelCreationForm = () =>
  useForm<ChannelCreationFormValues>();
