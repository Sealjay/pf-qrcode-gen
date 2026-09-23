import { render } from 'preact';
import './index.css';
import QRCodeGenerator from './components/QRCodeGenerator';

render(<QRCodeGenerator />, document.getElementById('root') as HTMLElement);
