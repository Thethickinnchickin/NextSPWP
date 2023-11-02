import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faPauseCircle, faFastForward, faBackward, faFastBackward, faRandom, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { Fade } from "react-bootstrap";


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [data, setData] = useState(null);
  const [songItem, setSongItem] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [volume, setVolume] = useState(5); // Initial volume level

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get("access_token");
    const expiresIn = params.get("expires_in");

    if (token && expiresIn) {
        setAccessToken(token);
        const expirationTime = Date.now() + expiresIn * 1000; // Convert to milliseconds
        setTokenExpiration(expirationTime);
        setLoading(false);
    } else {
        getAccessToken(); // Get the access token from your server
    }
}, []);

useEffect(() => {
    if (accessToken && tokenExpiration) {
        if (Date.now() > tokenExpiration) {
            handleLogout();
        } 


        if (accessToken) {
            fetchData();
            getCurrentTrack();
        }
    }
}, [accessToken, tokenExpiration]);

const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
  
    const apiUrl = `https://api.spotify.com/v1/me/player/volume?volume_percent=${newVolume}`;
  
    fetch(apiUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setVolume(newVolume);
        console.log("Volume Changed");
      })
      .catch((error) => {
        console.error("Error changing volume: ", error);
      });
};

async function fetchData() {
    try {
        const apiUrl = "https://api.spotify.com/v1/me/player";
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const result = await response.json();
        setData(result);
        setVolume(result.device.volume_percent) // Set the data here

        // ... other code ...
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const getAccessToken = async () => {
    try {
        const response = await fetch("/get-access-token", {
            method: "POST",
        });
        const data = await response.json();
        setAccessToken(data.accessToken);
        const expirationTime = Date.now() + 3600 * 1000; // Assuming an hour validity
        setTokenExpiration(expirationTime);
    } catch (error) {
        console.error("Error getting access token: ", error);
    }
};

const handleLogin = () => {
    const clientId = process.env.Client_ID; // Replace with your Spotify App's Client ID
    const redirectUri = process.env.Redirect_URL;
    const scopes = "user-read-private user-read-email user-modify-playback-state";
    const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${encodeURIComponent(scopes)}&response_type=token`;
    window.location.href = loginUrl;
};

const toggleShuffle = async () => {
    console.log(data)
    const apiUrl = `https://api.spotify.com/v1/me/player/shuffle?state=${!data.shuffle_state}`;

    fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            getCurrentTrack();
            console.log("Skipped to the next track");
        })
        .catch((error) => {
            console.error("Error skipping to the next track: ", error);
        });



};

const toggleRepeat = async (state) => {

    
    const apiUrl = `https://api.spotify.com/v1/me/player/repeat?state=${state}`;

    fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            getCurrentTrack();
            console.log("Skipped to the next track");
        })
        .catch((error) => {
            console.error("Error skipping to the next track: ", error);
        });



};

const getCurrentTrack = async () => {
    const apiUrl = "https://api.spotify.com/v1/me/player/currently-playing?additional_types=episode";

    const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

            if (!response.ok) {

                throw new Error("Network response was not ok");
            }



            const result = await response.json();
            let image = '';
            console.log("hey matt")
            console.log(result)
            if(result?.item?.album?.images) {
                image = result.item.album.images[0].url
            } else {
                image = result.item.images[0].url
            }

            setArtwork(image)

            setSongItem(result.item)


        
};

const playPlayback = async () => {
    const apiUrl = "https://api.spotify.com/v1/me/player/play";

    fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            getCurrentTrack();
            console.log("Skipped to the next track");
        })
        .catch((error) => {
            console.error("Error skipping to the next track: ", error);
        });



};

const pausePlayback = async () => {
    const apiUrl = "https://api.spotify.com/v1/me/player/pause";

    fetch(apiUrl, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            getCurrentTrack();
            console.log("Skipped to the next track");
        })
        .catch((error) => {
            console.error("Error skipping to the next track: ", error);
        });

};

const skipToNextTrack = async () => {

    const apiUrl = "https://api.spotify.com/v1/me/player/next";

    fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            setTimeout(() => {
                getCurrentTrack();
              }, 1000);
 
            console.log("Skipped to the next track");
        })
        .catch((error) => {
            console.error("Error skipping to the next track: ", error);
        });

    
};
  
const skipToPreviousTrack = async () => {
    const apiUrl = "https://api.spotify.com/v1/me/player/previous";

    fetch(apiUrl, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            fetchData();
            setTimeout(() => {
                getCurrentTrack();
              }, 1000);
 
        })
        .catch((error) => {
            console.error("Error skipping to the next track: ", error);
        });

};

const handleLogout = () => {
    // You can implement your logout logic here
    setAccessToken(null);
    setTokenExpiration(null);
    setLoading(true);
};


if (loading) {
    return <button onClick={handleLogin}>Login</button>;
}

return (
    <div className="container d-flex flex-column justify-content-between" style={{ minHeight: '100vh' }}>
    <div className="row main-row">
      <div className="col-9 d-flex justify-content-center ">
        <div className="container">
        <div className="row">
            <div className="col title-name">
                {songItem ? (     
                  <div>
                <a  
              target="_blank" 
              rel="noopener noreferrer"
              className="custom-link"
            href={songItem?.external_urls?.spotify}
            onClick={(e) => {
              console.log('Link clicked');
              if (!songItem?.external_urls?.spotify) {
                console.log(songItem)
                e.preventDefault(); 
              }
            }}>{songItem.name}</a> <br/> <div className="name">
                    {songItem.type === "track" ? (
                       <a  
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="custom-link"
                     href={songItem?.artists[0]?.external_urls?.spotify}
                     onClick={(e) => {
                       console.log('Link clicked');
                       if (!songItem?.artists[0]?.external_urls?.spotify) {
                         console.log(songItem)
                         e.preventDefault(); 
                       }
                     }}>{songItem.artists[0].name}</a> 
                    ) : (<>{songItem.show.name}</> )}
                    
                    </div>
                  </div>          
) : (<></>)}
            </div>
        </div>
        <div className="row "> 
            <div className="mb-3">
            <FontAwesomeIcon className="fa button-32 mx-1 fa-fast-backward" icon={faFastBackward} onClick={skipToPreviousTrack}/>
                {data && data['is_playing'] ? (

                        <FontAwesomeIcon className="fa button-32 mx-1 fa-pause" icon={faPauseCircle} onClick={pausePlayback}/>
                    ) : (
                        <FontAwesomeIcon className="fa button-32 mx-1 fa-play" icon={faPlayCircle} onClick={playPlayback}/>
                    )}
                    <FontAwesomeIcon className="fa  button-32 mx-1 fa-fast-forward" icon={faFastForward} onClick={skipToNextTrack}/>

                    {songItem?.type === "track" ? (
                <>
                    {data && data.shuffle_state ? (
                        <FontAwesomeIcon className="fa fa-random button-28 shuffle-on" icon={faRandom} onClick={toggleShuffle} />
                    ) : (
                        <FontAwesomeIcon className="fa fa-random button-28 shuffle-off" icon={faRandom} onClick={toggleShuffle} />
                    )}
                    {data?.repeat_state && data.repeat_state === "off" ? (
                        <FontAwesomeIcon className="fa fa-retweet button-28 shuffle-off" icon={faRetweet} onClick={() => toggleRepeat("context")} />
                    ) : (
                        <FontAwesomeIcon className="fa fa-retweet button-28 shuffle-on" icon={faRetweet} onClick={() => toggleRepeat("context")} />
                    )}
                </>) : (
                    <></>
                )}
            </div>
            <div className="col">
            <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider" /* Add the class for styling */
                    />
            </div>
        </div>   
        </div>               
      </div>
      <div className="col-3 d-flex justify-content-center">

        {songItem ? (           
           <div className="row-4">
            <a  
              target="_blank"  // Add this attribute
              rel="noopener noreferrer"
              className="custom-link"
            href={songItem?.external_urls?.spotify}
          onClick={(e) => {
            console.log('Link clicked');
            if (!songItem?.external_urls?.spotify) {
              console.log(songItem)
              e.preventDefault(); // Prevent the default link behavior if URL is not valid
            }
          }}>
            <img className="image" src={artwork} alt="song"/>
            </a>
            
          </div>) : (
          <>
          </>
          )}

      </div>
    </div>
  </div>

);
}
