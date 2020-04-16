import React from 'react'
import PropTypes from 'prop-types'
import {ArrowRight} from 'react-feather'

import colors from '../../styles/colors'

import {formatDate} from '../../lib/date'

const TransfertPopup = ({debutTransfert, finTransfert, typeVecteur, regionDepart, regionArrivee, paysArrivee, nbPatientsTransferes}) => {
  const startDate = formatDate(debutTransfert)
  const endDate = formatDate(finTransfert)

  return (
    <div className='sumup-container'>
      <div className='title'>{debutTransfert === finTransfert ? (
        <>Le {startDate}</>
      ) : (
        <>Du {startDate} au {endDate}</>
      )}</div>
      <div className='text'>{nbPatientsTransferes} patients transférés </div>
      <div><span className='red'>{regionDepart}</span> <ArrowRight style={{verticalAlign: 'sub'}} /> <span className='blue'>{regionArrivee || 'Europe'}</span></div>
      <div className='footer'>Moyen de transport : <span>{Array.isArray(typeVecteur) ? typeVecteur.join(', ') : typeVecteur}</span></div>
      <div className='infos'>Cliquez pour plus d’informations</div>

      <style jsx>{`
      .title {
        font-weight: bold;
        text-align: center;
        padding-bottom: .3em;
      }

      .text {
        text-align: center;
        padding: .5em;
      }

      .red {
        color: ${colors.red};
        font-weight: bold;
        padding: .5em;
      }

      .blue {
        color: ${colors.blue};
        font-weight: bold;
        padding: .5em;
      }

      .infos {
        font-size: small;
        font-weight: bold;
        font-style: italic;
        padding-top: 1em;
      }

      .footer {
        font-size: small;
        font-style: italic;
        padding-top: 1.5em;
      }
    `}</style>
    </div>
  )
}

TransfertPopup.defaultProps = {
  regionArrivee: null,
  paysArrivee: null
}

TransfertPopup.propTypes = {
  debutTransfert: PropTypes.string.isRequired,
  finTransfert: PropTypes.string.isRequired,
  typeVecteur: PropTypes.string.isRequired,
  regionDepart: PropTypes.string.isRequired,
  regionArrivee: PropTypes.string,
  paysArrivee: PropTypes.string,
  nbPatientsTransferes: PropTypes.string.isRequired
}

export default TransfertPopup