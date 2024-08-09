import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import PasswordChange from '../forms/PasswordChange';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

const PasswordPopover = () => {
  return (
    <li>
      <OverlayTrigger
        trigger='click'
        placement='bottom'
        overlay={
          <Popover id='popover-picture' className='large-popover'>
            <Popover.Header as='h3'>Change Password</Popover.Header>
            <Popover.Body>
              <div>
                <PasswordChange />
              </div>
            </Popover.Body>
          </Popover>
        }
        rootClose // This will allow the popover to close when clicking outside of it
      >
        <Link className='dropdown-item d-flex gap-2 align-items-center'>
          <FontAwesomeIcon
            icon={faEdit}
            className='me-2'
            width='16'
            height='16'
          />
          Password
        </Link>
      </OverlayTrigger>
    </li>
  );
};

export default PasswordPopover;
