// https://github.com/react-dnd/react-dnd/issues/186#issuecomment-282789420
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export default DragDropContext(HTML5Backend);
