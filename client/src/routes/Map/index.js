import React, { useRef, useEffect, useState } from 'react';
import MapHeader from 'components/Header/Homeheader';
import { useDispatch } from 'react-redux';
import { addMap } from 'redux/Slices/Map';
import Example from './Example';
import { faBlackTie } from '@fortawesome/free-brands-svg-icons';
import UserInfo from './UserInfo';
import Walk from 'components/Overlay/Walk';
import styled from 'styled-components';
import { Btn, SearchBar, SearchBtn, SearchContainer } from './MapStyle';
import UserComment from './Reply';
import { BaseIcon } from 'components/Icon';
import petchingPuppyImg from '../../assets/img/profile/petchingPuppyImg.png';
import Icon2 from '../../assets/img/icons/Icon.png';
// import makeMarker from './utils';

const SEOUL_COORDINATION = [37.529789809685475, 126.96470201104091];

function Index() {
  const mapRef = useRef(null);
  const { kakao } = window;
  const dispatch = useDispatch();

  const [isWalkOpen, setIsWalkOpen] = useState(false);
  const openWalkHandler = () => {
    // console.log(isWalkOpen);
    setIsWalkOpen(!isWalkOpen);
  };

  const [inputText, setInputText] = useState('');
  const [place, setPlace] = useState('');

  const onChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPlace(inputText);
    setInputText('');
    console.log(inputText);
  };

  const [isMarkerSelected, setIsMarkerSelected] = useState(false);

  const [coordinate, setCoordinate] = useState([]);

  useEffect(() => {
    const mapOptions = {
      center: new kakao.maps.LatLng(...SEOUL_COORDINATION),
      level: 7,
    };

    //장소 검색시, 이를 좌표화.
    try {
      const map = new kakao.maps.Map(mapRef.current, mapOptions);

      dispatch(addMap(map));

      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(place, placesSearchCB);

      // 주소-좌표 변환 객체를 생성
      const geocoder = new kakao.maps.services.Geocoder();
      // const callback = function (result, status) {
      //   if (status === kakao.maps.services.Status.OK) {
      // console.log(result[0].x, result[0].y);
      //     coordinate.push(result[0].x, result[0].y); (내가 추가한 문장)
      //     console.log(coordinate);
      //   }
      // };

      geocoder.addressSearch(place, placesSearchCB);

      function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
          let bounds = new kakao.maps.LatLngBounds();

          for (let i = 0; i < data.length; i++) {
            displayMarker(data[i]);
            bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            //x랑 y좌표 얻어지게끔?
            coordinate.push([data[i].x, data[i].y]);
          }

          map.setBounds(bounds);
          console.log(coordinate);
        }
      }

      function displayMarker(place) {
        let marker = new kakao.maps.Marker({
          map: map,
          position: new kakao.maps.LatLng(place.y, place.x),
          clickable: true,
        });

        kakao.maps.event.addListener(marker, 'click', () => {
          setIsMarkerSelected(true);
        });
        marker.setMap(map);
      }
    } catch (err) {
      console.log(err);
    }

    return () => {};
  }, [place]);

  return (
    <>
      <MapHeader className="MapHeader" />
      <MapMain>
        <MapContainer ref={mapRef} searchPlace={place} className="MapContainer">
          <SearchContainer className="inputForm" onSubmit={handleSubmit}>
            <SearchBar
              placeholder="장소 검색"
              onChange={onChange}
              value={inputText}
            ></SearchBar>
            <SearchBtn type="submit">검색</SearchBtn>
          </SearchContainer>
          <Btn onClick={openWalkHandler}>산책등록</Btn>
          {isWalkOpen === true ? (
            <Walk setIsWalkOpen={setIsWalkOpen}></Walk>
          ) : null}
          {/* <SearchBar type="text" placeholder="장소 검색"></SearchBar> */}
        </MapContainer>
        <UserInfoContainer>
          <UserContainer>
            {isMarkerSelected ? (
              <UserCard>
                <UserInfo
                  puppyName="강아지 이름 테스트 입니다"
                  userName="사람 이름 테스트 입니다"
                  puppyAge={7}
                  introduceTo="소개글 테스트 입니다"
                ></UserInfo>
                <UserComment className="flex-center-C Reply"></UserComment>
              </UserCard>
            ) : (
              <div
                className="titleContent"
                style={{ textAlign: 'center', paddingTop: '80%' }}
              >
                <Title>핀을 클릭해서 친구들을 만나보세요</Title>
                <MainImg src={petchingPuppyImg}></MainImg>
              </div>
            )}
          </UserContainer>
        </UserInfoContainer>
      </MapMain>
    </>
  );
}
const MapMain = styled.main`
  display: flex;
  height: calc(100vh - 7rem);
  & .MapContainer {
    flex: 0.65;
  }
  & .UserInfoContainer {
    flex: 0.35;
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    height: 102rem;
    & .MapContainer {
      min-height: 20rem;
      max-height: 35rem;
    }
    & .UserInfoContainer {
      flex: 1;
    }
  }
  @media screen and (min-width: 1400px) {
    & .MapContainer {
      flex: 0.75;
    }
    & .UserInfoContainer {
      flex: 0.25;
    }
  }
`;

const MapContainer = styled.div`
  min-height: 50rem;
  position: relative;
`;

const UserInfoContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.secondColor};
`;

const UserContainer = styled.div`
  /* @media screen and (max-width: px) {
  } */
  align-items: center;
  width: 30%;
  height: 100%;
  background: #febeb0;
  position: absolute;
  top: 10;
  right: 0;
  z-index: 100;
  /* display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  grid-template-rows: 1fr 1fr 1fr; */
`;

const Title = styled.div`
  color: #f7f1ed;
  font-size: 30px;
  justify-content: center;
  align-items: center;
  /* margin-top: 20%;
  bottom: 3rem; */
`;

const MainImg = styled.img`
  width: 230px;
  height: 230px;

  /* FIXME: 수평 가운데 맞추기 */
`;

//# When pin clicked
const UserCard = styled.section`
  display: flex;
  flex-direction: column;

  position: fixed;
  height: 100%;
  min-height: 50rem;
  background-color: white;

  & .UserInfo {
    background-color: white;
    flex: 0.2;
  }

  & .Reply {
    flex: 0.8;
  }

  @media screen and (min-width: 567px) and (max-width: 900px) {
    & .UserInfo {
      flex: 0.3;
    }

    & .Reply {
      flex: 0.7;
    }
  }
`;

export default Index;
