import { Component, ErrorInfo } from "react";
import { ReactNode } from "react"; // Import ReactNode for children typing

interface State {
  hasError: boolean;
}

interface Props {
  children: ReactNode; // Define children prop here
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error) {
    // Update state to render fallback UI on error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error information if needed
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children; // Render the children if no error
  }
}

export default ErrorBoundary;
