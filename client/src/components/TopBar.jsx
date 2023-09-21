import React from 'react';
import {useSelector} from "react-redux";

const TopBar = () => {
    const {theme} = useSelector(state=>state.theme);
    const {user} = useSelector(state=>state.user);
    // const dispatch = useDispatch();

  return (
    <div>TopBar</div>
  )
}

export default TopBar