import React, {useState, useContext} from 'react'
import PropTypes from 'prop-types'
import Router from 'next/router'
import {Popup} from 'react-map-gl'
import {Maximize2} from 'react-feather'

import {AppContext} from '../../pages'
import {getReport, reportToGeoJSON} from '../../lib/data'

import maps from '../maps'

import Map from './map'
import SumUp from './sumup'

const SITE_URL = process.env.SITE_URL

const ReactMapGL = ({code, hidePopup, hideAttribution}) => {
  const {
    date,
    selectedMapIdx,
    isIframe,
    isMobileDevice
  } = useContext(AppContext)

  const [hovered, setHovered] = useState(null)

  const currentMap = maps[selectedMapIdx]
  const report = getReport(date, code === 'FR' ? 'REG' : 'DEP')
  const layerData = reportToGeoJSON(report, date)

  const onHover = event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]
    const [longitude, latitude] = event.lngLat
    let hoverInfo

    if (feature) {
      hoverInfo = {
        longitude,
        latitude,
        feature
      }
    }

    setHovered(hoverInfo)
  }

  const onClick = event => {
    event.stopPropagation()
    const feature = event.features && event.features[0]

    if (feature) {
      const [typeTerritoire, codeTerritoire] = feature.properties.code.split('-')
      Router.push({
        pathname: '/',
        query: {
          location: feature.properties.code
        }
      }, `/${typeTerritoire === 'REG' ? 'regions' : 'departements'}/${codeTerritoire}`)
    } else {
      Router.push({
        pathname: '/'
      })
    }

    setHovered(null)
  }

  return (
    <div className='map-container'>
      <div className='controls'>

        {isIframe && code === 'FR' && (
          <div className='control maximize'>
            <a href={SITE_URL} target='_top'><Maximize2 style={{verticalAlign: 'middle'}} /></a>
          </div>
        )}
      </div>

      <Map
        code={code}
        data={layerData}
        layers={currentMap.layers}
        hideAttribution={hideAttribution}
        onHover={isMobileDevice ? null : onHover}
        onClick={onClick}
      >
        {hovered && !hidePopup && (
          <Popup
            longitude={hovered.longitude}
            latitude={hovered.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setHovered(null)}
            anchor='bottom-left'
          >
            <SumUp nom={hovered.feature.properties.nom} />
          </Popup>
        )}
      </Map>

      <style jsx>{`
        .map-container {
          display: flex;
          position: relative;
          width: 100%;
          height: 100%;
        }

        .controls {
          z-index: 2;
          position: absolute;
          display: flex;
          justify-content: end;
          align-items: start;
          width: 100%;
          padding: 0.5em;
        }

        .control {
          background-color: #000000aa;
          color: #fff;
          border-radius: 4px;
          margin: 0;
        }

        .maximize {
          display: flex;
          right: 0;
          border-radius: 4px;
          background: #53514f;
        }

        .maximize a {
          color: #fff;
          padding: 0.4em;
        }
      `}</style>
    </div>
  )
}

ReactMapGL.defaultProps = {
  hidePopup: false,
  hideAttribution: false
}

ReactMapGL.propTypes = {
  code: PropTypes.string.isRequired,
  hidePopup: PropTypes.bool,
  hideAttribution: PropTypes.bool
}

export default ReactMapGL
