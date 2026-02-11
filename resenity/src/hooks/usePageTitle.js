import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    
    if (title) {
      document.title = `${title} | Resenity`;
    } else {
      document.title = "Resenity - League of Legends Match Predictions";
    }
    
    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}