import { GetServerSideProps } from "next";
import type { AppProps } from "next/app";
import { DragDropContext, resetServerContext } from "react-beautiful-dnd";
import "~/styles/globals.css";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
