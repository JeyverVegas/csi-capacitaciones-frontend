import FeedbackComponents from './components/FeedbackComponents/FeedbackComponents';
import { useFeedBack } from './context/FeedBackContext';
import './css/style.css';
import RoutesLinks from './routes/RoutesLinks';

function App() {

  const { } = useFeedBack();

  return (
    <>
      <FeedbackComponents />
      <RoutesLinks></RoutesLinks>
    </>
  );
}

export default App;
