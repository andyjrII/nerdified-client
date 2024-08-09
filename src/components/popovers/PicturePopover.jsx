import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ImageChange from '../forms/ImageChange';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const PicturePopover = ({ email }) => {
  return (
    <li>
      <OverlayTrigger
        trigger='click'
        placement='bottom'
        overlay={
          <Popover id='popover-picture' className='large-popover'>
            <Popover.Header as='h3'>Update Picture</Popover.Header>
            <Popover.Body>
              <div>
                <ImageChange email={email} />
              </div>
            </Popover.Body>
          </Popover>
        }
        rootClose // This will allow the popover to close when clicking outside of it
      >
        <Link className='dropdown-item d-flex gap-2 align-items-center'>
          <FontAwesomeIcon
            icon={faImage}
            className='me-2'
            width='16'
            height='16'
          />
          Picture
        </Link>
      </OverlayTrigger>
    </li>
  );
};

export default PicturePopover;
