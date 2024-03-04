'use client'
import withAuth from '../components/withAuth';
import SideBar from './components/SideBar';
import MessageContainer from './components/MessageContainer';

function MessagePage() {
  return (
    <>  
      <div className='flex h-full overflow-hidden bg-gray-50 rounded-lg'>
        <SideBar />
        <MessageContainer />
      </div>
    </>	
	);
}

export default withAuth(MessagePage)
