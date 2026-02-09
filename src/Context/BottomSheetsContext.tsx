import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useState,
} from "react";

const BottomSheetsContext = createContext<{
  isHistoryBottomSheetOpen: boolean;
  setIsHistoryBottomSheetOpen: Dispatch<SetStateAction<boolean>>;
}>({
  isHistoryBottomSheetOpen: false,
  setIsHistoryBottomSheetOpen: () => {},
});

export const BottomSheetsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isHistoryBottomSheetOpen, setIsHistoryBottomSheetOpen] =
    useState<boolean>(false);
  return (
    <BottomSheetsContext.Provider
      value={{
        isHistoryBottomSheetOpen,
        setIsHistoryBottomSheetOpen,
      }}
    >
      {children}
    </BottomSheetsContext.Provider>
  );
};

export function useBottomSheetsContext() {
  return useContext(BottomSheetsContext);
}
