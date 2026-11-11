# [1.4.0](https://github.com/Dygmalab/Bazecor/compare/v1.3.3...v1.4.0) (2023-09-27)


### Bug Fixes

* add cross-env so env. variables can be used in different OSs ([#488](https://github.com/Dygmalab/Bazecor/issues/488)) ([400cd6c](https://github.com/Dygmalab/Bazecor/commit/400cd6c9d861bf3566a02a2aa3c36f5a73f5dcbd))
* added delay after close to prevent race conditions ([54ea281](https://github.com/Dygmalab/Bazecor/commit/54ea28178c50f96248f2a77e9c0fd9d7698911ed))
* added protection to close only if the unplugged device is the one connected ([f925578](https://github.com/Dygmalab/Bazecor/commit/f9255789186e7d5ce51abd5a5cb5981a7ffbdf38))
* added udev rules for Dygma USB VID number ([1bf911f](https://github.com/Dygmalab/Bazecor/commit/1bf911f52e119a86a3190c4359f73e7c7d1cab14))
* **app jsx:** fix warning about props ([88612fa](https://github.com/Dygmalab/Bazecor/commit/88612fa5af038638606cee0b81020be17078496a))
* bootloader enumeration of Raise neuron tried to read ChipID ([#478](https://github.com/Dygmalab/Bazecor/issues/478)) ([7d19587](https://github.com/Dygmalab/Bazecor/commit/7d19587c857830f482eaaa2782e573660bd181d7))
* **buttons:** added new colors to improve the accessibility in buttons ([94cb722](https://github.com/Dygmalab/Bazecor/commit/94cb7229cded220a06df80dbcd271d8ea768f96b))
* **buttons:** fixed buttons focus statuses ([f4b490a](https://github.com/Dygmalab/Bazecor/commit/f4b490ad4d715f402424c0e4f49647d7ab2ed91c))
* changed filter to take into account proper beta versioning name ([#483](https://github.com/Dygmalab/Bazecor/issues/483)) ([ca3b853](https://github.com/Dygmalab/Bazecor/commit/ca3b85367995cc4867844b07757dc9ded9736c1e))
* changed the way that different battery status is rendered ([b74c04d](https://github.com/Dygmalab/Bazecor/commit/b74c04d2c9e929d55f935a90d47d177af20d9448))
* changed the way the battery status is render in sidebarmenu ([258addc](https://github.com/Dygmalab/Bazecor/commit/258addcf0da009ca45b4b97a40c3d1494a479125))
* **firmware image help:** remove play video listener when component is unmount ([7a3d527](https://github.com/Dygmalab/Bazecor/commit/7a3d527d5572345447d5e229aa6214c6f9117f7b))
* **firmwareerrorpanel:** removed loading status in FirmwareErrorPanel component ([a1a968f](https://github.com/Dygmalab/Bazecor/commit/a1a968f8606ae0c1141b27213d366a4da17b1bc3))
* fix responsive issues in ordinary keyboard ([39745a9](https://github.com/Dygmalab/Bazecor/commit/39745a98ee05948b65185c8798df248a0731b1fb))
* fixed defy-t3 key shape on Defy keyboard representation ([4cc3cc9](https://github.com/Dygmalab/Bazecor/commit/4cc3cc935530361e63d489e808d279fec111ae86))
* fixed timeout errors when calling serialport commands ([d8b760f](https://github.com/Dygmalab/Bazecor/commit/d8b760f32851ca5362b3e19bba908a219c3f46ef))
* Fixed windows11 serialport detection issue and listdrives issue ([8d893fa](https://github.com/Dygmalab/Bazecor/commit/8d893fa9f3651658dfd8d954e162ae49d26264ce))
* improve mask values in battery svgs ([6553499](https://github.com/Dygmalab/Bazecor/commit/655349993aa95c916c31d8d3bf9fdd40a3b91f74))
* iPC handlers where being set twice, now they del previous handler when creating new one ([#476](https://github.com/Dygmalab/Bazecor/issues/476)) ([8cef57a](https://github.com/Dygmalab/Bazecor/commit/8cef57a1d4ca0847166ce325a8d6f47f8c7f88f8))
* **logoloadercentered:** fixed type on LogoLoaderCentered component ([a7d6d2e](https://github.com/Dygmalab/Bazecor/commit/a7d6d2ede0d76043bf30ac7df6a564671909375d))
* macro names could be searched upon undefined macros ([#477](https://github.com/Dygmalab/Bazecor/issues/477)) ([5a42532](https://github.com/Dygmalab/Bazecor/commit/5a42532ea9e6fb1a028c9e851f313da4c0d2f700))
* make own job for bumping version ([2ee598a](https://github.com/Dygmalab/Bazecor/commit/2ee598a92725cf20e2d48f46402ac58793be6802))
* **navigation menu file:** fix timeout on navigation menu ([391cbf9](https://github.com/Dygmalab/Bazecor/commit/391cbf99f25944f393c0967a9a6da3e3e9d8567b))
* **recordmacromodal:** fixed the autocus after the user start a record a macro ([dc65bca](https://github.com/Dygmalab/Bazecor/commit/dc65bca4a5d274e23ec534ef1520af412fd96e2f))
* **recormacroeditormodal:** fixed the button width in Macro Editor ([df05bb8](https://github.com/Dygmalab/Bazecor/commit/df05bb8f9ba06e6b2195fd81eefbedec599270e7))
* remove properly usb when closing window ([ef9942c](https://github.com/Dygmalab/Bazecor/commit/ef9942cf5f60f309a15c48f8383f02b6c118c872))
* remove universal from make-dev ([c822ad7](https://github.com/Dygmalab/Bazecor/commit/c822ad7e598a373fda9ea7cf333e1f76b6aca21c))
* removed await because it was blocking the startup of Bazecor ([a5f9a0c](https://github.com/Dygmalab/Bazecor/commit/a5f9a0cc03beb010d1a0c9c0e62d6c8d6021fc7b))
* removing of ble devices when upgrade ([#498](https://github.com/Dygmalab/Bazecor/issues/498)) ([8e17024](https://github.com/Dygmalab/Bazecor/commit/8e17024647412c2d7d36e5ed1489d9f749872543))
* run semantic-release before release build so we jump version ([1bf2911](https://github.com/Dygmalab/Bazecor/commit/1bf2911c625ea7bca4016895173537204a51d849))
* sides now flash without instabilities ([#452](https://github.com/Dygmalab/Bazecor/issues/452)) ([231af48](https://github.com/Dygmalab/Bazecor/commit/231af48a9b16fb525e7ebabab6a4786ba17caaf4))
* solved battery saving mode state retrieval issues ([0b1c8b7](https://github.com/Dygmalab/Bazecor/commit/0b1c8b753937f48be7ffa831675b93cdd5de3867))
* tabIdex was missing for discard/save buttons ([#453](https://github.com/Dygmalab/Bazecor/issues/453)) ([74cdfda](https://github.com/Dygmalab/Bazecor/commit/74cdfda13443b76b09e23711ff50c8a8e92eb468))
* using usb event close to send a focus.close to the port handler ([78b0f5b](https://github.com/Dygmalab/Bazecor/commit/78b0f5b4a09e1c44028bef758a698cf95e50c65b))


### Features

* a dummy addition to readme to trigger release ([3532052](https://github.com/Dygmalab/Bazecor/commit/35320524bc6897359e1ef577c52bd376dc703bae))
* add Bazecor version in a visible place so that users and customer support can check it ([#470](https://github.com/Dygmalab/Bazecor/issues/470)) ([3349f13](https://github.com/Dygmalab/Bazecor/commit/3349f13b699140cea5d0056088004113c2e300eb))
* add British layout, so Defy shows ISO English ([#491](https://github.com/Dygmalab/Bazecor/issues/491)) ([dd4fee9](https://github.com/Dygmalab/Bazecor/commit/dd4fee9951b78cb76529b4b53ce814e86a2c5adf))
* added a product info when export single layer ([18c1193](https://github.com/Dygmalab/Bazecor/commit/18c1193ac16a32a6e23294c343e79d47e560e1a0))
* added check to know if it's the first hardware Defy that's being plugged in bazecor ([#471](https://github.com/Dygmalab/Bazecor/issues/471)) ([631378d](https://github.com/Dygmalab/Bazecor/commit/631378d0a3603b1b2b579dc2a9b439fd3994a9d9))
* added UG slider to control brightness ([#450](https://github.com/Dygmalab/Bazecor/issues/450)) ([0e72cc1](https://github.com/Dygmalab/Bazecor/commit/0e72cc1443eebed28e2ab6abf7ea322b9096b934))
* Added wireless features to Defy ([#454](https://github.com/Dygmalab/Bazecor/issues/454)) ([63ea1ba](https://github.com/Dygmalab/Bazecor/commit/63ea1ba3d124c53bc998591f8c9dc40938a66618))


### Reverts

* Revert "fix: removing of ble devices when upgrade (#498)" (#502) ([8df0032](https://github.com/Dygmalab/Bazecor/commit/8df00320b5f6bd473d41a83161d3a761166400fa)), closes [#498](https://github.com/Dygmalab/Bazecor/issues/498) [#502](https://github.com/Dygmalab/Bazecor/issues/502)
* remove async from main load process ([5e40db9](https://github.com/Dygmalab/Bazecor/commit/5e40db955a2c29fea14929971e0f78b1a5fe83dc))

## [1.3.3](https://github.com/Dygmalab/Bazecor/compare/v1.3.2...v1.3.3) (2023-09-26)


### Bug Fixes

* semantic release ([#509](https://github.com/Dygmalab/Bazecor/issues/509)) ([49d83b0](https://github.com/Dygmalab/Bazecor/commit/49d83b007194b66db6e29ef601f462e58330f786))
