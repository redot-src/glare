/**
 * Entry for the UMD / CDN build. Exposes the class itself as `window.Glare`,
 * so `Glare.bind()` and `Glare.open()` work straight from a <script> tag.
 */
import './styles/index.css'
import { Glare } from './core/Glare'

export default Glare
