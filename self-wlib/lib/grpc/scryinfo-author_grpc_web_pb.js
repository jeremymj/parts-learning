/**
 * @fileoverview gRPC-Web generated client stub for scryinfo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.scryinfo = require('./scryinfo-author_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.scryinfo.AuthorClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.scryinfo.AuthorPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!proto.scryinfo.AuthorClient} The delegate callback based client
   */
  this.delegateClient_ = new proto.scryinfo.AuthorClient(
      hostname, credentials, options);

};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.scryinfo.AuthorDataRequest,
 *   !proto.scryinfo.AuthorDataResponse>}
 */
const methodInfo_Author_ConnectInit = new grpc.web.AbstractClientBase.MethodInfo(
  proto.scryinfo.AuthorDataResponse,
  /** @param {!proto.scryinfo.AuthorDataRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.scryinfo.AuthorDataResponse.deserializeBinary
);


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.scryinfo.AuthorDataResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.scryinfo.AuthorDataResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorClient.prototype.connectInit =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/scryinfo.Author/ConnectInit',
      request,
      metadata,
      methodInfo_Author_ConnectInit,
      callback);
};


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.scryinfo.AuthorDataResponse>}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorPromiseClient.prototype.connectInit =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.connectInit(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.scryinfo.AuthorDataRequest,
 *   !proto.scryinfo.AuthorDataResponse>}
 */
const methodInfo_Author_AgreeRandom = new grpc.web.AbstractClientBase.MethodInfo(
  proto.scryinfo.AuthorDataResponse,
  /** @param {!proto.scryinfo.AuthorDataRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.scryinfo.AuthorDataResponse.deserializeBinary
);


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.scryinfo.AuthorDataResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.scryinfo.AuthorDataResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorClient.prototype.agreeRandom =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/scryinfo.Author/AgreeRandom',
      request,
      metadata,
      methodInfo_Author_AgreeRandom,
      callback);
};


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.scryinfo.AuthorDataResponse>}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorPromiseClient.prototype.agreeRandom =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.agreeRandom(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.scryinfo.AuthorDataRequest,
 *   !proto.scryinfo.AuthorDataResponse>}
 */
const methodInfo_Author_AgreeToken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.scryinfo.AuthorDataResponse,
  /** @param {!proto.scryinfo.AuthorDataRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.scryinfo.AuthorDataResponse.deserializeBinary
);


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.scryinfo.AuthorDataResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.scryinfo.AuthorDataResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorClient.prototype.agreeToken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/scryinfo.Author/AgreeToken',
      request,
      metadata,
      methodInfo_Author_AgreeToken,
      callback);
};


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.scryinfo.AuthorDataResponse>}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorPromiseClient.prototype.agreeToken =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.agreeToken(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.scryinfo.AuthorDataRequest,
 *   !proto.scryinfo.AuthorDataResponse>}
 */
const methodInfo_Author_FreshToken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.scryinfo.AuthorDataResponse,
  /** @param {!proto.scryinfo.AuthorDataRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.scryinfo.AuthorDataResponse.deserializeBinary
);


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.scryinfo.AuthorDataResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.scryinfo.AuthorDataResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorClient.prototype.freshToken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/scryinfo.Author/FreshToken',
      request,
      metadata,
      methodInfo_Author_FreshToken,
      callback);
};


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.scryinfo.AuthorDataResponse>}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorPromiseClient.prototype.freshToken =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.freshToken(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.scryinfo.AuthorDataRequest,
 *   !proto.scryinfo.AuthorDataResponse>}
 */
const methodInfo_Author_VerifyToken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.scryinfo.AuthorDataResponse,
  /** @param {!proto.scryinfo.AuthorDataRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.scryinfo.AuthorDataResponse.deserializeBinary
);


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.scryinfo.AuthorDataResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.scryinfo.AuthorDataResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorClient.prototype.verifyToken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/scryinfo.Author/VerifyToken',
      request,
      metadata,
      methodInfo_Author_VerifyToken,
      callback);
};


/**
 * @param {!proto.scryinfo.AuthorDataRequest} request The
 *     request proto
 * @param {!Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.scryinfo.AuthorDataResponse>}
 *     The XHR Node Readable Stream
 */
proto.scryinfo.AuthorPromiseClient.prototype.verifyToken =
    function(request, metadata) {
  return new Promise((resolve, reject) => {
    this.delegateClient_.verifyToken(
      request, metadata, (error, response) => {
        error ? reject(error) : resolve(response);
      });
  });
};


module.exports = proto.scryinfo;

